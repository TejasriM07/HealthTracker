import {
  HeartIcon,
  BoltIcon,
  GlobeAltIcon,
  FireIcon,
  SparklesIcon,
  UserIcon,
  TrophyIcon,
  PuzzlePieceIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

export const workoutIcons = {
  'Running': HeartIcon,
  'Cycling': BoltIcon,
  'Weightlifting': TrophyIcon,
  'Swimming': GlobeAltIcon,
  'Yoga': SparklesIcon,
  'Walking': UserIcon,
  'Basketball': FireIcon,
  'Tennis': PuzzlePieceIcon,
  'Other': BeakerIcon
};

export const workoutOptions = [
  'Running',
  'Cycling',
  'Weightlifting',
  'Swimming',
  'Yoga',
  'Walking',
  'Basketball',
  'Tennis',
  'Other'
];

export const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};