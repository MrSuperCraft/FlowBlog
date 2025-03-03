import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Globe, Palette } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: FileText,
      title: "Easy Content Creation",
      description:
        "Intuitive editor with markdown support for effortless writing and formatting.",
    },
    {
      icon: Globe,
      title: "SEO Optimization",
      description:
        "Built-in tools to help your content rank higher in search engines.",
    },
    {
      icon: Palette,
      title: "Customizable Themes",
      description:
        "Choose from a variety of themes or create your own to match your brand.",
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl mb-16">
          Key Features
        </h2>
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <feature.icon className="h-10 w-10 mb-4 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="pb-4">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
