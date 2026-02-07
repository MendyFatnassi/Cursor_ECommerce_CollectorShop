import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://host.docker.internal:8082";
const DEFAULT_PASSWORD = __ENV.USER_PASSWORD || "K6pass123";

export const options = {
  stages: [
    { duration: "1m", target: 10 },
    { duration: "2m", target: 30 },
    { duration: "2m", target: 60 },
    { duration: "1m", target: 0 }
  ],
  thresholds: {
    http_req_duration: ["p(95)<800"],
    http_req_failed: ["rate<0.01"]
  }
};

const endpoints = [
  { method: "GET", path: "/api/recommendations", weight: 25 },
  { method: "GET", path: "/api/ads/slots", weight: 10 },
  { method: "GET", path: "/api/chat/threads?context=buyer", weight: 10 },
  { method: "GET", path: "/api/notifications", weight: 10 },
  { method: "GET", path: "/api/notifications/preferences", weight: 10 },
  { method: "GET", path: "/api/seller/listings", weight: 10 },
  { method: "GET", path: "/api/profiles/me", weight: 15, auth: true },
  { method: "POST", path: "/api/profiles/interests", weight: 10, auth: true, body: { tag: "retro" } }
];

function pickEndpoint() {
  const total = endpoints.reduce((sum, item) => sum + item.weight, 0);
  const hit = Math.random() * total;
  let acc = 0;
  for (const item of endpoints) {
    acc += item.weight;
    if (hit <= acc) {
      return item;
    }
  }
  return endpoints[0];
}

function registerUser(email, password) {
  const payload = JSON.stringify({
    fullName: "K6 User",
    email,
    password,
    acceptedTerms: true
  });
  const res = http.post(`${BASE_URL}/api/auth/register`, payload, {
    headers: { "Content-Type": "application/json" }
  });
  return res;
}

function loginUser(email, password) {
  const payload = JSON.stringify({ email, password });
  const res = http.post(`${BASE_URL}/api/auth/login`, payload, {
    headers: { "Content-Type": "application/json" }
  });
  return res;
}

export function setup() {
  const email = __ENV.USER_EMAIL || `k6_${Date.now()}@example.com`;
  const password = DEFAULT_PASSWORD;

  const registerRes = registerUser(email, password);
  if (registerRes.status !== 201 && registerRes.status !== 409) {
    throw new Error(`Register failed: ${registerRes.status} ${registerRes.body}`);
  }

  const loginRes = loginUser(email, password);
  if (loginRes.status !== 200) {
    throw new Error(`Login failed: ${loginRes.status} ${loginRes.body}`);
  }

  const body = loginRes.json();
  if (!body || !body.token) {
    throw new Error("Login response missing token");
  }

  return { token: body.token, baseUrl: BASE_URL };
}

export default function (data) {
  const target = pickEndpoint();
  const url = `${data.baseUrl}${target.path}`;
  const headers = target.auth
    ? { "Content-Type": "application/json", Authorization: `Bearer ${data.token}` }
    : { "Content-Type": "application/json" };

  let res;
  if (target.method === "POST") {
    res = http.post(url, JSON.stringify(target.body || {}), { headers });
  } else {
    res = http.get(url, { headers });
  }

  check(res, {
    "status 2xx": r => r.status >= 200 && r.status < 300
  });
  sleep(1);
}
