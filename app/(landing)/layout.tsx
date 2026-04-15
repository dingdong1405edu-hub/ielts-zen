import { auth } from '@/lib/auth'
import { Navbar } from '@/components/layout/navbar'

export default async function LandingLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <>
      <Navbar user={session?.user} />
      <main>{children}</main>
    </>
  )
}
