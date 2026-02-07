import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://host.docker.internal:8082";

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
  { path: "/api/recommendations", weight: 45 },
  { path: "/api/ads/slots", weight: 15 },
  { path: "/api/chat/threads?context=buyer", weight: 15 },
  { path: "/api/notifications", weight: 15 },
  { path: "/api/notifications/preferences", weight: 10 }
];

function pickEndpoint() {
  const total = endpoints.reduce((sum, item) => sum + item.weight, 0);
  const hit = Math.random() * total;
  let acc = 0;
  for (const item of endpoints) {
    acc += item.weight;
    if (hit <= acc) {
      return item.path;
    }
  }
  return endpoints[0].path;
}

export default function () {
  const path = pickEndpoint();
  const res = http.get(`${BASE_URL}${path}`);
  check(res, {
    "status 2xx": r => r.status >= 200 && r.status < 300
  });
  sleep(1);
}
