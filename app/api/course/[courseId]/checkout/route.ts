import { db } from "@/lib/prisma_client";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST (
  req: Request, 
  { params }: {params: { courseId: string }}
) {
  
  const courseId = params.courseId;

  try {
    
    const user = await currentUser();
    
    if(!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", {status: 401});
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true
      }
    })

    const purchase = await db.purchese.findUnique({
      where: {
        userId_courseId: {
          courseId,
          userId: user.id,
        }
      }
    })

    if(purchase) {
      return new NextResponse("Already purchased", {status: 401});
    }

    if(!course) {
      return new NextResponse("Course not found", {status: 404});
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course.title,
            description: course.description!
          },
          unit_amount: Math.round(course.price! *100),
        }
      }
    ];

    let stripeCustomer = await db.stripCustomer.findUnique({
      where: {
        userId: user.id
      },
      select: {
        stripCustomerId: true
      }
    });

    if(!stripeCustomer) {
      
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress
      })

      stripeCustomer = await db.stripCustomer.create({
        data: {
          userId: user.id,
          stripCustomerId: customer.id
        }
      })
    };

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripCustomerId,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/course/${course.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/course/${course.id}?canceled=1`,
      metadata: {
        courseId: course.id,
        userId: user.id
      }

    })

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.log("[COURSE_ID_CHECKOUT]", error);
    return new NextResponse("Internal Error", {status: 500});
  }
}