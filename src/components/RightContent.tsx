import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AvatarWrapper,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

const trendingTopics = ["Technology", "Travel", "Food", "Lifestyle", "Health"];

const suggestedAuthors = [
  { name: "Alice Johnson", avatar: "https://github.com/shadcn.png" },
  { name: "Bob Smith", avatar: "https://github.com/shadcn.png" },
  { name: "Carol Williams", avatar: "https://github.com/shadcn.png" },
];

export default function RightContent() {
  return (
    <div className="hidden lg:block pr-12 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Trending Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {trendingTopics.map((topic) => (
              <li
                key={topic}
                className="text-sm hover:underline cursor-pointer"
              >
                #{topic}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Suggested Authors</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {suggestedAuthors.map((author) => (
              <li key={author.name} className="flex items-center space-x-2">
                <AvatarWrapper>
                  <AvatarImage src={author.avatar} alt={author.name} />
                  <AvatarFallback>{author.name[0]}</AvatarFallback>
                </AvatarWrapper>
                <span className="text-sm font-medium">{author.name}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
