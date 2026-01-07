import { ListingSummary } from '@types/index';

interface PaymentStatusCardProps {
  listing: ListingSummary;
}

const PaymentStatusCard = ({ listing }: PaymentStatusCardProps) => (
  <article className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="font-semibold">{listing.title}</p>
        <p className="text-sm text-slate-500">
          {listing.price} {listing.currency}
        </p>
      </div>
      <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600">{listing.status}</span>
    </div>
    <p className="text-xs text-slate-400 mt-2">Paiement sécurisé Collector.shop • CB uniquement</p>
  </article>
);

export default PaymentStatusCard;




