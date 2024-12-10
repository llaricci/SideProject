import Link from 'next/link';

export default function Error() {
    return (
        <div>
            <h1>An error has occurred
            </h1>
            <br />
            <Link href="/">
                Return to Homepage
            </Link>
        </div>
    );
}
