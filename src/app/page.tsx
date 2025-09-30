import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
   Card,
   CardAction,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
export default function Home() {
   return (
      <div className="font-sans grid ">
         <Card className="w-96">
            <CardHeader>
               <CardTitle>Card Title</CardTitle>
               <CardDescription>Card Description</CardDescription>
               <CardAction>Card Action</CardAction>
            </CardHeader>
            <CardContent className="flex flex-col items-start space-y-4">
               <Link href="/topups">
                  <Button variant={"link"}>Top Ups</Button>
               </Link>
               <Link href="/orders">
                  <Button variant={"link"}>Orders</Button>
               </Link>
               
            </CardContent>
            <CardFooter>
               <p>Card Footer</p>
            </CardFooter>
         </Card>
      </div>
   );
}
