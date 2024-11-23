import App from './app'

export default function AppPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // newCustomer=true
  return <App newCustomer={searchParams?.newCustomer === 'true'} />
}
