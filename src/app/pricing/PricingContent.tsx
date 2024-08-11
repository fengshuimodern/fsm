import { Button } from "@/components/ui/button"

const pricingPlans = [
  {
    name: "Basic",
    price: "$9.99",
    features: ["1 room layout", "Basic Fengshui analysis", "Email support"],
  },
  {
    name: "Pro",
    price: "$19.99",
    features: ["5 room layouts", "Advanced Fengshui analysis", "Priority email support", "Custom recommendations"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Unlimited room layouts", "Full Fengshui consultation", "24/7 phone support", "API access"],
  },
]

export default function PricingContent() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pricing Plans</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Choose the perfect plan for your FengShuiModern needs
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
          {pricingPlans.map((plan, planIdx) => (
            <div key={plan.name} className={`flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 ${planIdx === 1 ? 'lg:z-10 lg:rounded-b-none' : planIdx === 0 ? 'lg:rounded-r-none' : 'lg:rounded-l-none'}`}>
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg font-semibold leading-8 text-gray-900">{plan.name}</h3>
                </div>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">{plan.price}</span>
                  {plan.name !== "Enterprise" && <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>}
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Button className="mt-8 px-6 py-3" variant={planIdx === 1 ? "professional" : "outline"}>
                Get started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}