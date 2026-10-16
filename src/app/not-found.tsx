import Link from 'next/link';
export default function NotFound(){return <div className="container no-result" style={{minHeight:400}}><h1>Page not found</h1><p>The link may have changed or this learning collection is not available.</p><Link className="btn btn-primary" href="/">Return home</Link></div>}
