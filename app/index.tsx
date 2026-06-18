import { Redirect } from 'expo-router';

import { ROUTES } from '@/presentation/navigation/routes';

const Index = () => <Redirect href={ROUTES.home} />;

export default Index;
