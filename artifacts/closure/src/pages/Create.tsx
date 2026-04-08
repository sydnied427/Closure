import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { getOrCreateSessionId } from "@/lib/session";
import { useCreateClosureBox } from "@workspace/api-client-react";
import { 
  CreateClosureBoxRequestTheme, 
  CreateClosureBoxRequestIntention, 
  CreateClosureBoxRequestFate,
  CreateClosureBoxRequest 
} from "@workspace/api-client-react/src/generated/api.schemas";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mic, Image as ImageIcon, Video, X, Calendar as CalendarIcon, ArrowRight, ArrowLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

export default function Create() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Partial<CreateClosureBoxRequest>>({
    theme: "classic" as CreateClosureBoxRequestTheme,
    intention: "grief" as CreateClosureBoxRequestIntention,
    recipientName: "",
    letterContent: "",
    fate: "seal" as CreateClosureBoxRequestFate,
    fateDate: null,
    audioData: null,
    photoData: null,
    videoData: null,
  });

  const sessionId = useRef<string>("");
  useEffect(() => {
    sessionId.current = getOrCreateSessionId();
  }, []);

  const createBox = useCreateClosureBox();

  const handleNext = () => setStep(s => Math.min(s + 1, 6));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!formData.recipientName || !formData.letterContent) {
      toast({ title: "Incomplete", description: "Please provide a recipient and your letter.", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createBox.mutateAsync({
        data: {
          sessionId: sessionId.current,
          theme: formData.theme as CreateClosureBoxRequestTheme,
          intention: formData.intention as CreateClosureBoxRequestIntention,
          recipientName: formData.recipientName,
          letterContent: formData.letterContent,
          fate: formData.fate as CreateClosureBoxRequestFate,
          fateDate: formData.fateDate,
          audioData: formData.audioData,
          photoData: formData.photoData,
          videoData: formData.videoData,
        }
      });
      setStep(6); // Success screen
    } catch (error) {
      toast({ title: "Error", description: "Could not seal your box. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, type: 'photoData' | 'audioData' | 'videoData') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, [type]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (type: 'photoData' | 'audioData' | 'videoData') => {
    setFormData(prev => ({ ...prev, [type]: null }));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Bar */}
      {step < 6 && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 5) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      <div className="flex-grow flex flex-col items-center justify-center p-6 mt-16">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full max-w-3xl">
              <h2 className="text-3xl font-serif text-center mb-2">Choose your box</h2>
              <p className="text-center text-muted-foreground mb-12">The aesthetic container for your feelings.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'classic', name: 'Classic', desc: 'Warm parchment', color: 'bg-[#fcfbf9] border-[#dedbd8]' },
                  { id: 'modern', name: 'Modern', desc: 'Clean monochrome', color: 'bg-white border-gray-200 grayscale' },
                  { id: 'dark', name: 'Dark', desc: 'Deep navy charcoal', color: 'bg-slate-900 border-slate-700 text-white' },
                  { id: 'floral', name: 'Floral', desc: 'Soft botanical', color: 'bg-rose-50 border-rose-200' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setFormData(p => ({ ...p, theme: t.id as CreateClosureBoxRequestTheme }))}
                    className={`p-6 rounded-lg border text-left flex flex-col h-40 transition-all ${t.color} ${formData.theme === t.id ? 'ring-2 ring-primary ring-offset-2 scale-105' : 'hover:scale-105 shadow-sm'}`}
                  >
                    <span className="font-serif text-lg mt-auto">{t.name}</span>
                    <span className="text-xs opacity-70">{t.desc}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full max-w-2xl">
              <h2 className="text-3xl font-serif text-center mb-2">Set your intention</h2>
              <p className="text-center text-muted-foreground mb-12">What are you packaging today?</p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { id: 'grief', label: 'Grief', sub: 'For what is lost.' },
                  { id: 'gratitude', label: 'Gratitude', sub: 'For what was given.' },
                  { id: 'love', label: 'Love', sub: 'For what remains.' },
                  { id: 'anger', label: 'Anger', sub: 'For what was unjust.' },
                  { id: 'forgiveness', label: 'Forgiveness', sub: 'To release the debt.' },
                  { id: 'estrangement', label: 'Estrangement', sub: 'For the silent distance.' },
                ].map(i => (
                  <button
                    key={i.id}
                    onClick={() => setFormData(p => ({ ...p, intention: i.id as CreateClosureBoxRequestIntention }))}
                    className={`p-6 rounded border transition-all text-left ${formData.intention === i.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-card border-border hover:bg-muted/50'}`}
                  >
                    <h3 className="font-serif text-xl mb-1">{i.label}</h3>
                    <p className="text-sm text-muted-foreground">{i.sub}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full max-w-2xl">
              <h2 className="text-3xl font-serif text-center mb-2">Write the letter</h2>
              <p className="text-center text-muted-foreground mb-8">This is your sacred space. Say everything you need to.</p>
              
              <div className="space-y-6 bg-card p-8 rounded-lg border shadow-sm">
                <div>
                  <Label htmlFor="recipient" className="text-muted-foreground font-serif text-lg mb-2 block">To:</Label>
                  <Input 
                    id="recipient" 
                    value={formData.recipientName || ''} 
                    onChange={e => setFormData(p => ({ ...p, recipientName: e.target.value }))}
                    placeholder="Their name..."
                    className="border-0 border-b rounded-none px-0 text-xl font-serif focus-visible:ring-0 focus-visible:border-primary bg-transparent"
                  />
                </div>
                
                <div>
                  <Textarea 
                    value={formData.letterContent || ''} 
                    onChange={e => setFormData(p => ({ ...p, letterContent: e.target.value }))}
                    placeholder="Start writing..."
                    className="min-h-[300px] border-0 resize-none px-0 text-lg leading-relaxed focus-visible:ring-0 bg-transparent placeholder:font-serif placeholder:italic"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full max-w-xl">
              <h2 className="text-3xl font-serif text-center mb-2">Add a memory</h2>
              <p className="text-center text-muted-foreground mb-12">Optional. Attach something tangible to this box.</p>
              
              <div className="space-y-4">
                {/* Photo */}
                <div className="p-6 rounded border bg-card flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <ImageIcon size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium">Photograph</h4>
                      <p className="text-sm text-muted-foreground">Attach a picture</p>
                    </div>
                  </div>
                  {formData.photoData ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Attached</span>
                      <Button variant="ghost" size="icon" onClick={() => removeFile('photoData')}><X size={16} /></Button>
                    </div>
                  ) : (
                    <Label className="cursor-pointer px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 text-sm font-medium transition-colors">
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleFile(e, 'photoData')} />
                    </Label>
                  )}
                </div>

                {/* Audio */}
                <div className="p-6 rounded border bg-card flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Mic size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium">Voice Note</h4>
                      <p className="text-sm text-muted-foreground">Attach an audio file</p>
                    </div>
                  </div>
                  {formData.audioData ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Attached</span>
                      <Button variant="ghost" size="icon" onClick={() => removeFile('audioData')}><X size={16} /></Button>
                    </div>
                  ) : (
                    <Label className="cursor-pointer px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 text-sm font-medium transition-colors">
                      Upload
                      <input type="file" accept="audio/*" className="hidden" onChange={e => handleFile(e, 'audioData')} />
                    </Label>
                  )}
                </div>

                {/* Video */}
                <div className="p-6 rounded border bg-card flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Video size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium">Video</h4>
                      <p className="text-sm text-muted-foreground">Attach a short clip</p>
                    </div>
                  </div>
                  {formData.videoData ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Attached</span>
                      <Button variant="ghost" size="icon" onClick={() => removeFile('videoData')}><X size={16} /></Button>
                    </div>
                  ) : (
                    <Label className="cursor-pointer px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 text-sm font-medium transition-colors">
                      Upload
                      <input type="file" accept="video/*" className="hidden" onChange={e => handleFile(e, 'videoData')} />
                    </Label>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full max-w-2xl">
              <h2 className="text-3xl font-serif text-center mb-2">Choose its fate</h2>
              <p className="text-center text-muted-foreground mb-12">What happens to this box now?</p>
              
              <div className="space-y-4">
                {[
                  { id: 'seal', title: 'Seal away', desc: 'Lock it in your archive indefinitely.' },
                  { id: 'open_on_date', title: 'Time capsule', desc: 'Lock it until a specific future date.' },
                  { id: 'release', title: 'Release it', desc: 'Let it go entirely. Keep the record, release the weight.' },
                ].map(f => (
                  <div key={f.id} className="relative">
                    <button
                      onClick={() => setFormData(p => ({ ...p, fate: f.id as CreateClosureBoxRequestFate }))}
                      className={`w-full p-6 rounded border text-left transition-all ${formData.fate === f.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-card border-border hover:bg-muted/50'}`}
                    >
                      <h3 className="font-serif text-xl mb-1">{f.title}</h3>
                      <p className="text-sm text-muted-foreground">{f.desc}</p>
                    </button>
                    
                    {formData.fate === 'open_on_date' && f.id === 'open_on_date' && (
                      <div className="mt-4 p-4 bg-muted/30 border rounded flex items-center gap-4">
                        <Label className="text-sm font-medium whitespace-nowrap">Unlock on:</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal bg-background">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.fateDate ? format(new Date(formData.fateDate), "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.fateDate ? new Date(formData.fateDate) : undefined}
                              onSelect={(d) => setFormData(p => ({ ...p, fateDate: d ? d.toISOString() : null }))}
                              initialFocus
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div key="step6" variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 text-primary">
                <Lock size={40} className="opacity-80" />
              </div>
              <h2 className="text-4xl font-serif mb-4">Your box is sealed.</h2>
              <p className="text-muted-foreground mb-12 text-lg">
                It is safe. You can let go now.
              </p>
              <Button onClick={() => setLocation("/my-boxes")} size="lg" className="px-8 font-medium">
                Return to Archive
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      {step < 6 && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur border-t flex justify-between items-center z-40">
          <Button variant="ghost" onClick={handlePrev} disabled={step === 1 || isSubmitting} className="font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          
          {step < 5 ? (
            <Button onClick={handleNext} className="px-8 font-medium">
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="px-8 font-medium">
              {isSubmitting ? "Sealing..." : "Seal Box"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
