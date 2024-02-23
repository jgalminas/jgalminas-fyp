import { MatchWithGoldFrames } from '@fyp/types';
import Card from '@renderer/core/Card';
import { ClientRequestBuilder } from '@renderer/util/request';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { GoldAdvantageChart } from '../components/GoldAdvantageChart';
import Loading from '@renderer/core/Loading';

const Timeline = () => {

  const { matchId } = useParams();

  const { data, isLoading } = useQuery<MatchWithGoldFrames>({
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
        { !isLoading ?
          data
          ? <GoldAdvantageChart data={data}/>
          : null
          : <Loading className="my-72"/>
        }
      </Card>
    </div>
  )
}

export default Timeline;