"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

const questions = [
  {
    id: 1,
    question: "Hat Ihr Unternehmen elektrische Betriebsmittel wie PCs, Drucker oder Küchengeräte?",
    hint: "Nahezu alle Unternehmen haben elektrische Betriebsmittel.",
  },
  {
    id: 2,
    question: "Wurden diese Betriebsmittel in den letzten 2 Jahren offiziell geprüft?",
    hint: "Ohne regelmäßige Prüfung besteht Haftungsrisiko.",
  },
  {
    id: 3,
    question: "Haben Sie ein aktuelles digitales Prüfprotokoll für Ihre Geräte?",
    hint: "Prüfprotokolle sind im Schadensfall rechtlich relevant.",
  },
  {
    id: 4,
    question: "Verwalten Sie die Prüffristen Ihrer Geräte aktiv?",
    hint: "Abgelaufene Fristen können zu Bußgeldern führen.",
  },
  {
    id: 5,
    question: "Sind Sie mit dem aktuellen Aufwand für Ihre DGUV-Prüfungen zufrieden?",
    hint: "NeuraVolt übernimmt den gesamten Verwaltungsaufwand.",
  },
];

type Answer = "ja" | "nein";

export default function DGUVCheckWidget() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [done, setDone] = useState(false);

  const handleAnswer = (answer: Answer) => {
    const next = [...answers, answer];
    setAnswers(next);
    if (step + 1 >= questions.length) {
      setDone(true);
    } else {
      setStep(s => s + 1);
    }
  };

  // Needs service if: has devices (Q1=ja) AND (not recently checked OR no protocol OR no deadline management OR not satisfied)
  const needsService = answers[0] === "ja" && (
    answers[1] === "nein" || answers[2] === "nein" || answers[3] === "nein" || answers[4] === "nein"
  );

  const progress = done ? 100 : (step / questions.length) * 100;

  return (
    <div className="w-full bg-muted/30 border border-border rounded-2xl overflow-hidden">
      {/* Progress */}
      <div className="h-1 bg-border">
        <motion.div
          className="h-full bg-primary"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold text-primary">Frage {step + 1} von {questions.length}</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2 leading-snug">
                {questions[step].question}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">{questions[step].hint}</p>
              <div className="flex gap-3">
                <Button
                  size="lg"
                  onClick={() => handleAnswer("ja")}
                  className="flex-1 rounded-xl bg-foreground hover:bg-foreground/90 text-white"
                >
                  Ja
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleAnswer("nein")}
                  className="flex-1 rounded-xl"
                >
                  Nein
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              {needsService ? (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Handlungsbedarf erkannt
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                    Basierend auf Ihren Antworten besteht Optimierungspotenzial bei Ihren DGUV V3 Prüfungen. NeuraVolt hilft Ihnen, compliant zu bleiben.
                  </p>
                  <Button className="rounded-full px-8 bg-foreground hover:bg-foreground/90 text-white" asChild>
                    <Link href="/contact">
                      Kostenlose Beratung
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-7 w-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Gut aufgestellt!
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                    Ihre DGUV V3 Situation scheint gut organisiert. Dennoch können wir Ihnen helfen, effizienter zu werden.
                  </p>
                  <Button variant="outline" className="rounded-full px-8" asChild>
                    <Link href="/contact">
                      Angebot anfragen
                    </Link>
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
