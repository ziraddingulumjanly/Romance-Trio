import Link from 'next/link';

/** One fixed-size transparent logo canvas per theme; does not alter layout on toggle. */
export default function Brand({compact=false}:{compact?:boolean}){
 return <Link href="/" className={'brand '+(compact?'brand-small':'')} aria-label="Romance Trio home">
  <img className="brand-logo brand-logo-light" src="/images/romance-trio-logo-light.png" alt="" width={960} height={216} decoding="async" />
  <img className="brand-logo brand-logo-dark" src="/images/romance-trio-logo-dark.png" alt="" width={960} height={216} decoding="async" />
 </Link>;
}
