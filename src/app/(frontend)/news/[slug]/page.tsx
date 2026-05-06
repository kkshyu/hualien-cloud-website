import { redirect } from 'next/navigation'

export default async function LegacyNewsDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  redirect(`/zh/news/${slug}`)
}
