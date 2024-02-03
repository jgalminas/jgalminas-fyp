import { MatchWithGoldFrames } from '@fyp/types';
import Card from '@renderer/core/Card';
import { ClientRequestBuilder } from '@renderer/util/request';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { GoldAdvantageChart } from '../components/GoldAdvantageChart';

const Timeline = () => {

  const { matchId } = useParams();

  const { data } = useQuery<MatchWithGoldFrames>({
    queryKey: ['gold', matchId],
    queryFn: async() => {
      const res = await new ClientRequestBuilder()
        .route(`/v1/match/${matchId}/gold`)
        .fetch();
      return await res.json();
    }
  });

  return (
    <div>
      <Card className='overflow-x-hidden flex flex-col'>
        <p className="mb-4 text-star-dust-300 uppercase font-medium text-xs"> Team Gold Advantage </p>
        { data
          ? <GoldAdvantageChart data={data}/>
          : null
        }
      </Card>
    </div>
  )
}

export default Timeline;