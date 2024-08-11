"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

export default function TipsAndTricks() {
  return (
    <section className="bg-background rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Tips & Tricks</h2>
        <p className="text-muted-foreground">
          Explore Feng Shui tips and tricks.
        </p>
      </div>
      <div className="p-6">
        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem>
              <div className="flex items-start gap-4">
                <img
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  width={64}
                  height={64}
                  alt="Mirror placement"
                  className="rounded-md"
                  style={{ aspectRatio: "64/64", objectFit: "cover" }}
                />
                <div>
                  <h3 className="font-medium">Placement of Mirrors</h3>
                  <p className="text-sm text-muted-foreground">
                    Strategically placing mirrors can enhance the flow of energy in your space.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Learn More
                  </Button>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="flex items-start gap-4">
                <img
                  src="https://images.unsplash.com/photo-1507908708918-778587c9e563?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  width={64}
                  height={64}
                  alt="Color balance"
                  className="rounded-md"
                  style={{ aspectRatio: "64/64", objectFit: "cover" }}
                />
                <div>
                  <h3 className="font-medium">Balancing Colors</h3>
                  <p className="text-sm text-muted-foreground">
                    Understand how to use colors to create harmony in your space.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Learn More
                  </Button>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="flex items-start gap-4">
                <img
                  src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  width={64}
                  height={64}
                  alt="Lighting placement"
                  className="rounded-md"
                  style={{ aspectRatio: "64/64", objectFit: "cover" }}
                />
                <div>
                  <h3 className="font-medium">Lighting Placement</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn how to position lighting fixtures to enhance the energy flow in your space.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Learn More
                  </Button>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
