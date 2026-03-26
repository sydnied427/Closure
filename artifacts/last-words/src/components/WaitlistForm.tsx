import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useJoinWaitlist } from '@workspace/api-client-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type WaitlistFormValues = z.infer<typeof waitlistSchema>;

export function WaitlistForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistSchema),
  });

  const joinWaitlistMutation = useJoinWaitlist();

  const onSubmit = async (data: WaitlistFormValues) => {
    try {
      await joinWaitlistMutation.mutateAsync({ data });
      setIsSuccess(true);
      reset();
    } catch (error) {
      // The hook handles the error state, we can just log or rely on the mutation error object
      console.error("Failed to join waitlist", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-12 relative">
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center space-y-4 py-8 bg-card rounded-xl border border-border shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-center px-6">
              <h4 className="font-serif text-xl font-medium text-foreground mb-2">You're on the list.</h4>
              <p className="text-muted-foreground text-sm">We'll reach out when space opens up.</p>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="relative"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  {...register("email")}
                  placeholder="Your email address"
                  className="h-12 bg-card border-border text-base focus-visible:ring-primary/50"
                  disabled={joinWaitlistMutation.isPending}
                />
                {errors.email && (
                  <span className="absolute -bottom-6 left-1 text-xs text-destructive">
                    {errors.email.message}
                  </span>
                )}
                {joinWaitlistMutation.isError && !errors.email && (
                  <span className="absolute -bottom-6 left-1 text-xs text-destructive">
                    This email is already on the list or invalid.
                  </span>
                )}
              </div>
              <Button 
                type="submit" 
                size="lg"
                className="h-12 w-full sm:w-auto font-serif text-base tracking-wide bg-foreground text-background hover:bg-foreground/90 transition-all shadow-md hover:shadow-lg"
                disabled={joinWaitlistMutation.isPending}
              >
                {joinWaitlistMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Join Waitlist <ArrowRight className="ml-2 w-4 h-4 opacity-70" />
                  </>
                )}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
