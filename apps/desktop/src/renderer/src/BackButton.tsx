import ChevronLeft from '@assets/icons/ChevronLeft.svg?react';
import LinkButton from './core/LinkButton';

export type BackButtonProps = {
  to: string | -1
}

const BackButton = ({ to }: BackButtonProps) => {

  return (
    <LinkButton to={to} type='text' className='flex items-center gap-2 pr-5'>
      <ChevronLeft className='h-4 w-4 stroke-2'/>
      Back
    </LinkButton>
  )
}

export default BackButton;
