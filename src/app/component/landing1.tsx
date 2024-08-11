import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckIcon } from '../components/Icons'
import Layout from '../components/Layout'
import Image from "next/image"

export default function Landing() {
  return (
    <Layout>
      <section className="bg-muted py-12 md:py-20 lg:py-28">
        <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Optimize Your Space with Fengshui AI
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Unlock the power of Fengshui to create harmonious and prosperous living spaces. Our AI-powered room
              planning tool helps you design the perfect layout for your home or office.
            </p>
            <div className="flex gap-4">
              <Link href="/planner">
                <Button variant="professional" className="px-6 py-3">Get Started</Button>
              </Link>
              <Button variant="outline" className="px-6 py-3 hover:bg-primary/10 transition-colors duration-300">Learn More</Button>
            </div>
          </div>
          <div className="relative">
            <Image
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
              width={600}
              height={400}
              alt="Fengshui AI Room Planner"
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>
      </section>
      <section id="features" className="py-12 md:py-20 lg:py-28">
        <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-8 items-center">
          <div className="relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary to-primary/50 rounded-lg" />
            <div className="relative z-10 p-6 md:p-8 lg:p-10 bg-white rounded-lg shadow-lg">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Drag & Drop Room Layout</h2>
              <p className="text-muted-foreground text-lg md:text-xl mb-6">
                Easily arrange your furniture and decor with our intuitive drag-and-drop interface. See how your space
                will look before you make any changes.
              </p>
              <Link href="/planner"><Button variant="professional">Analyze Room</Button></Link>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">Fengshui Optimization</h2>
            <p className="text-muted-foreground text-lg md:text-xl">
              Our AI-powered Fengshui analysis evaluates your room layout and provides personalized recommendations to
              improve the flow of energy and create a harmonious environment.
            </p>
            <ul className="space-y-2 text-lg md:text-xl">
              <li className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-primary" />
                Identify optimal furniture placement
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-primary" />
                Enhance natural lighting and ventilation
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-primary" />
                Promote positive energy flow
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="bg-muted py-12 md:py-20 lg:py-28">
        <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">Personalized Recommendations</h2>
            <p className="text-muted-foreground text-lg md:text-xl">
              Our Fengshui AI analyzes your room layout and provides personalized recommendations to enhance the
              energy flow and create a harmonious environment.
            </p>
            <ul className="space-y-2 text-lg md:text-xl">
              <li className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-primary" />
                Optimize furniture placement
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-primary" />
                Improve lighting and ventilation
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-primary" />
                Enhance positive energy flow
              </li>
            </ul>
          </div>
          <div className="relative">
            <Image
              src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
              width={600}
              height={400}
              alt="Fengshui AI Recommendations"
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>
      </section>
    </Layout>
  )
}