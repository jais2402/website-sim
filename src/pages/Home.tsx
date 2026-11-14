import {
  Button,
  Card,
  CtaLayout,
  FeatureGridLayout,
  HeroLayout,
  HorizontalScrollLayout,
  MarqueeLayout,
  PageLayout,
  type Feature,
  type NavLink,
} from '../layouts'

// Placeholder content: everything on the page is passed into layouts from here.
const LINKS: NavLink[] = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

const FEATURES: Feature[] = [
  { title: 'Smooth scroll', body: 'Lenis runs on the GSAP ticker, so every scroll-driven scene stays in sync.' },
  { title: 'Scroll scenes', body: 'Pinning, scrubbing and reveals live inside layouts you can drop on any page.' },
  { title: 'Pointer play', body: 'Magnetic buttons and a trailing cursor, switched off on touch devices.' },
]

const PROJECTS = [
  { title: 'Project one', tag: 'Brand' },
  { title: 'Project two', tag: 'Product' },
  { title: 'Project three', tag: 'Campaign' },
  { title: 'Project four', tag: 'Experience' },
]

const YEAR = new Date().getFullYear()

export function Home() {
  return (
    <PageLayout
      brand="Brand"
      links={LINKS}
      footer={
        <CtaLayout
          as="footer"
          id="contact"
          title="Let’s talk."
          actions={<Button href="mailto:hello@example.com">hello@example.com</Button>}
          note={`© ${YEAR} Your name`}
        />
      }
    >
      <HeroLayout
        eyebrow="Your tagline here"
        title="Motion that moves people."
        lede="A starter built from reusable motion layouts. Replace this copy with your own."
        actions={<Button href="#work">See the work</Button>}
      />
      <MarqueeLayout items={['Strategy', 'Design', 'Motion', 'Development', 'Launch']} />
      <FeatureGridLayout id="about" title="Built to feel alive, and to stay fast." items={FEATURES} />
      <HorizontalScrollLayout id="work" eyebrow="Selected work" title="Scroll down, travel sideways.">
        {PROJECTS.map((p, i) => (
          <Card key={p.title} index={`0${i + 1}`} tag={p.tag} title={p.title} />
        ))}
      </HorizontalScrollLayout>
    </PageLayout>
  )
}
