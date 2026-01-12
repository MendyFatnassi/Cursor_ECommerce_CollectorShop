import { ListingSummary } from '@types/index';

interface PaymentStatusCardProps {
  listing: ListingSummary;
}

const PaymentStatusCard = ({ listing }: PaymentStatusCardProps) => {
  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('en attente') || statusLower.includes('pending')) {
      return 'badge-warning';
    } else if (statusLower.includes('confirmé') || statusLower.includes('confirmed')) {
      return 'badge-success';
    } else if (statusLower.includes('annulé') || statusLower.includes('cancelled')) {
      return 'badge-danger';
    }
    return 'badge-info';
  };

  return (
    <article className="card p-6 hover:border-blue-300 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">
            {listing.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {listing.price}
            </span>
            <span className="text-sm text-slate-500">{listing.currency}</span>
          </div>
        </div>
        <span className={`badge ${getStatusBadge(listing.status)}`}>{listing.status}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500 pt-3 border-t border-slate-100">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        <span>Paiement sécurisé Collector.shop • CB uniquement</span>
      </div>
    </article>
  );
};

export default PaymentStatusCard;




