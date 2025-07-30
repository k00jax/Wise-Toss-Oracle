import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Share2, Download } from 'lucide-react';

interface OracleInterpretationProps {
  hexagram: any;
  onRestart: () => void;
}

export const OracleInterpretation = ({ hexagram, onRestart }: OracleInterpretationProps) => {
  const [interpretation, setInterpretation] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    generateInterpretation();
  }, [hexagram]);

  const generateInterpretation = async () => {
    setIsGenerating(true);
    
    // Simulate AI interpretation generation
    setTimeout(() => {
      const interpretations = [
        `The ${hexagram.name} suggests a time of ${hexagram.description.toLowerCase()}. The cosmic forces align to bring clarity to your situation. This hexagram speaks to the balance between action and receptivity, urging you to trust in the natural flow of events while remaining alert to opportunities for growth.`,
        
        `In consulting the ${hexagram.name}, the oracle reveals that you stand at a crossroads of potential. The ancient wisdom embedded in this hexagram illuminates the path forward, suggesting that patience and understanding are your greatest allies at this time. Consider how the image of ${hexagram.image.toLowerCase()} applies to your current circumstances.`,
        
        `The appearance of ${hexagram.name} in your reading indicates a profound moment of transformation. This hexagram has guided seekers for thousands of years, and its wisdom now flows to you. The judgment "${hexagram.judgment}" offers insight into the energies surrounding your question. Reflect deeply on how these ancient truths resonate with your present situation.`
      ];
      
      setInterpretation(interpretations[Math.floor(Math.random() * interpretations.length)]);
      setIsGenerating(false);
    }, 3000);
  };

  const reflectionPrompts = [
    "How does this wisdom apply to your current situation?",
    "What actions feel most aligned with this guidance?",
    "What patterns in your life does this hexagram illuminate?",
    "How can you embody the qualities this hexagram represents?"
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `I Ching Reading: ${hexagram.name}`,
        text: `My I Ching consultation revealed ${hexagram.name} (${hexagram.chinese}). ${interpretation}`,
      });
    } else {
      navigator.clipboard.writeText(
        `I Ching Reading: ${hexagram.name} (${hexagram.chinese})\n\n${interpretation}`
      );
    }
  };

  const handleDownload = () => {
    const content = `I Ching Oracle Reading
${new Date().toLocaleDateString()}

Hexagram: ${hexagram.number}. ${hexagram.name} (${hexagram.chinese})

Judgment: ${hexagram.judgment}

Image: ${hexagram.image}

Interpretation: ${interpretation}

Reflection Prompts:
${reflectionPrompts.map(prompt => `• ${prompt}`).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iching-reading-${hexagram.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-cosmic p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-6 mb-4">
            {/* Hexagram lines display */}
            <div className="space-y-1">
              {hexagram.lines.map((line: string, index: number) => {
                const baseClasses = "w-16 h-2 transition-all duration-300";
                return (
                  <div key={index}>
                    {line === 'yang' ? (
                      <div className={`${baseClasses} bg-primary shadow-oracle`}></div>
                    ) : (
                      <div className={`${baseClasses} flex justify-between`}>
                        <div className="w-7 h-2 bg-primary shadow-oracle"></div>
                        <div className="w-7 h-2 bg-primary shadow-oracle"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Your Oracle Reading
              </h2>
              <p className="text-muted-foreground">
                Wisdom from the {hexagram.name}
              </p>
            </div>
          </div>
        </div>

        <Card className="p-8 bg-gradient-ethereal border-primary/20 shadow-cosmic">
          <div className="space-y-6">
            {/* Hexagram Summary */}
            <div className="text-center border-b border-primary/20 pb-6">
              <h3 className="text-2xl font-bold text-primary mb-2">
                {hexagram.number}. {hexagram.name}
              </h3>
              <p className="text-3xl text-accent mb-3">{hexagram.chinese}</p>
              <p className="text-muted-foreground italic">"{hexagram.judgment}"</p>
            </div>

            {/* AI Interpretation */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 flex items-center">
                <div className="w-2 h-2 bg-accent rounded-full mr-3 animate-oracle-glow"></div>
                Personal Interpretation
              </h4>
              
              {isGenerating ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-muted-foreground">The oracle is contemplating your reading...</span>
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-3 bg-muted/30 rounded animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-foreground leading-relaxed">
                  {interpretation}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Reflection Prompts */}
        <Card className="p-6 bg-card/40 border-accent/20">
          <h4 className="font-semibold text-foreground mb-4">Reflection Prompts</h4>
          <div className="space-y-3">
            {reflectionPrompts.map((prompt, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2.5 flex-shrink-0"></div>
                <p className="text-muted-foreground">{prompt}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex items-center space-x-2 border-accent/30 hover:bg-accent/10"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Reading</span>
          </Button>
          
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex items-center space-x-2 border-accent/30 hover:bg-accent/10"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </Button>
          
          <Button
            onClick={onRestart}
            className="bg-gradient-sacred hover:shadow-oracle transition-all duration-500"
          >
            New Consultation
          </Button>
        </div>

        {/* Closing Blessing */}
        <div className="text-center pt-8">
          <p className="text-sm text-muted-foreground italic">
            "The superior man understands the transitory in the light of the eternity of the end."
          </p>
          <p className="text-xs text-muted-foreground mt-2">— I Ching</p>
        </div>
      </div>
    </div>
  );
};