import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PermitCard from '../../components/planner/PermitCard';
import { createItinerary, generateItinerarySuggestions } from '../../api/itineraries';
import Loader from '../../components/common/Loader';
import BeadDivider from '../../components/planner/BeadDivider';
import { ArrowLeft } from 'lucide-react';

export default function NewTrip() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCreateTrip = async (data: {
    name: string;
    startDate: string;
    endDate?: string;
    travelers: number;
    budget: number;
    coverImageUrl?: string;
  }) => {
    setLoading(true);
    setErrorMsg('');
    try {
      // 1. Create trip record
      const newTrip = await createItinerary(data);

      // 2. Ask Gemini AI to generate itinerary day & stop suggestions
      await generateItinerarySuggestions(newTrip.id);

      // 3. Navigate to the newly created trip detail route
      navigate(`/trips/${newTrip.id}`);
    } catch (err) {
      console.error('Failed to create trip permit:', err);
      setErrorMsg('Could not issue entry permit — please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="pb-12 max-w-[1000px] mx-auto px-4 md:px-6">
      {/* Back to trips link */}
      <button
        onClick={() => navigate('/trips')}
        className="flex items-center gap-1.5 text-[12.5px] font-bold text-[#2D5A3D] hover:text-[#1C3A2E] transition-colors mb-4"
      >
        <ArrowLeft size={14} /> My itineraries
      </button>

      <p className="text-[10px] font-mono tracking-widest text-[#C4522A] uppercase font-bold mb-1">
        Karibu Permits // Issuance
      </p>
      <h1 className="font-serif text-[28px] md:text-[34px] text-[#1C3A2E] font-semibold leading-tight m-0">
        Issue East Africa Entry Permit
      </h1>
      <p className="text-[14px] text-[#666] leading-relaxed max-w-[540px] mt-1.5 mb-2">
        Define your expedition parameters to generate daily trail itineraries, weather forecasts, and regional border requirements.
      </p>

      <BeadDivider />

      {errorMsg && (
        <p className="text-[13px] text-[#C4522A] bg-[#C4522A]/10 rounded-lg px-4 py-2.5 mb-6">{errorMsg}</p>
      )}

      {loading ? (
        <div className="bg-white border border-[#1C3A2E]/10 rounded-[18px] shadow-sm py-20 flex flex-col items-center justify-center my-6 gap-4 text-center">
          <Loader />
          <div>
            <p className="font-serif text-[18px] text-[#1C3A2E] font-semibold mb-1">Stamping your trail...</p>
            <p className="text-[12.5px] font-mono text-[#888]">Generating AI suggestions for your route</p>
          </div>
        </div>
      ) : (
        <PermitCard onCreate={handleCreateTrip} loading={loading} />
      )}
    </div>
  );
}
