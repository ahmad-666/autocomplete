import Link from 'next/link';
import Container from '@/components/Container';

const HomePage = () => {
    return (
        <div>
            <Container>
                <Link href='/test'>test</Link>
            </Container>
        </div>
    );
};

export default HomePage;
