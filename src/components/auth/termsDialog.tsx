'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TERMS_CONTENT, TERMS_TITLE } from '@/lib/termsContent'

interface TermsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TermsDialog({ open, onOpenChange }: TermsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-hidden sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{TERMS_TITLE}</DialogTitle>
        </DialogHeader>
        <div className="text-muted-foreground max-h-[60vh] space-y-4 overflow-y-auto pr-1 text-sm leading-relaxed">
          {TERMS_CONTENT.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
