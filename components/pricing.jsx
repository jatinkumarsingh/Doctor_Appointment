"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const plans = [
  {
    name: "Starter",
    credits: "1 consultation credit",
    price: "$0",
    description: "For exploring the platform and trying your first booking.",
  },
  {
    name: "Single Visit",
    credits: "1 paid consultation",
    price: "$29",
    description: "Best for a one-time appointment with a specialist.",
  },
  {
    name: "Care Bundle",
    credits: "5 consultation credits",
    price: "$119",
    description: "Best value for patients who need ongoing care.",
  },
];

const Pricing = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className="border-emerald-900/30 shadow-lg bg-gradient-to-b from-emerald-950/30 to-transparent"
        >
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">
              {plan.name}
            </CardTitle>
            <p className="text-3xl font-bold text-emerald-400">{plan.price}</p>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>{plan.credits}</p>
            <p>{plan.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Pricing;
