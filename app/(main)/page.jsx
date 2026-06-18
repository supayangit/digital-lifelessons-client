import { HeroSlider } from '@/src/components/home/HeroSlider'
import { FeaturedLessons } from '@/src/components/home/FeaturedLessons'
import { WhyLearnFromLife } from '@/src/components/home/WhyLearnFromLife'
import { TopContributors } from '@/src/components/home/TopContributors'
import { MostSavedLessons } from '@/src/components/home/MostSavedLessons'

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <FeaturedLessons />
      <WhyLearnFromLife />
      <TopContributors />
      <MostSavedLessons />
    </>
  )
}
