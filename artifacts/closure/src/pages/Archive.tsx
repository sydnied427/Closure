import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { getOrCreateSessionId } from "@/lib/session";
import { useListClosureBoxes, getListClosureBoxesQueryKey } from "@workspace/api-client-react";
import { Lock, Unlock, Wind, Image as ImageIcon, Mic, Video } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Archive() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  const { data: response, isLoading } = useListClosureBoxes(sessionId || "", {
    query: {
      enabled: !!sessionId,
      queryKey: getListClosureBoxesQueryKey(sessionId || ""),
    }
  });

  const boxes = response?.boxes || [];

  const getIntentionColor = (intention: string) => {
    switch (intention) {
      case "grief": return "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200";
      case "love": return "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200";
      case "anger": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "gratitude": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
      case "forgiveness": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "estrangement": return "bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getFateIcon = (fate: string, date?: string | null) => {
    if (fate === "release") return <Wind className="w-4 h-4" />;
    if (fate === "seal") return <Lock className="w-4 h-4" />;
    if (fate === "open_on_date") {
      const isPast = date ? new Date(date) <= new Date() : false;
      return isPast ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16">
          <h1 className="text-4xl font-serif text-foreground mb-4">My Archive</h1>
          <p className="text-muted-foreground font-light">
            A quiet record of the feelings you've chosen to process.
          </p>
        </header>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        ) : boxes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 bg-muted/30 border border-border/50 rounded-lg border-dashed"
          >
            <p className="text-xl font-serif text-foreground mb-6">Your archive is empty.</p>
            <Link 
              href="/create" 
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Create your first box
            </Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {boxes.map((box, i) => (
                <motion.div
                  key={box.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative p-6 rounded-lg border border-border bg-card shadow-sm flex flex-col h-full ${
                    box.theme === 'dark' ? 'bg-slate-900 text-slate-100 border-slate-800' : 
                    box.theme === 'classic' ? 'bg-[#fcfbf9] border-[#dedbd8]' :
                    box.theme === 'floral' ? 'bg-rose-50/30 border-rose-100' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className={`text-xs px-2.5 py-1 rounded-full capitalize font-medium ${getIntentionColor(box.intention)}`}>
                      {box.intention}
                    </span>
                    <div className="flex items-center gap-1 text-muted-foreground" title={box.fate.replace('_', ' ')}>
                      {getFateIcon(box.fate, box.fateDate)}
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-serif text-xl mb-1 truncate">For {box.recipientName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(box.createdAt), 'MMMM d, yyyy')}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex gap-2 text-muted-foreground">
                      {box.hasAudio && <Mic className="w-4 h-4" />}
                      {box.hasPhoto && <ImageIcon className="w-4 h-4" />}
                      {box.hasVideo && <Video className="w-4 h-4" />}
                    </div>
                    {box.fate === "open_on_date" && box.fateDate && (
                      <span className="text-xs text-muted-foreground font-mono">
                        Unlocks {format(new Date(box.fateDate), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
