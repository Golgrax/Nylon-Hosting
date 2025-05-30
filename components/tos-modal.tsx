"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import styles from "./tos-modal.module.css"

// Context to manage the ToS modal state
type ToSContextType = {
  isOpen: boolean
  openToS: (source?: string) => void
  closeToS: () => void
  acceptToS: () => void
  source: string | null
}

const ToSContext = createContext<ToSContextType | undefined>(undefined)

export function ToSProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [source, setSource] = useState<string | null>(null)

  // Check if ToS has been accepted previously
  useEffect(() => {
    const tosAccepted = localStorage.getItem("tos-accepted")
    if (tosAccepted) {
      setAccepted(true)
    }
  }, [])

  const openToS = (source?: string) => {
    setSource(source || null)
    setIsOpen(true)
  }

  const closeToS = () => {
    setIsOpen(false)
    // Reset source after modal is closed
    setTimeout(() => setSource(null), 300)
  }

  const acceptToS = () => {
    localStorage.setItem("tos-accepted", "true")
    setAccepted(true)
    setIsOpen(false)
    // Reset source after modal is closed
    setTimeout(() => setSource(null), 300)
  }

  return (
    <ToSContext.Provider value={{ isOpen, openToS, closeToS, acceptToS, source }}>
      {children}
      {isOpen && <ToSModal />}
    </ToSContext.Provider>
  )
}

export function useToS() {
  const context = useContext(ToSContext)
  if (context === undefined) {
    throw new Error("useToS must be used within a ToSProvider")
  }
  return context
}

// Button component to trigger the ToS modal
type TOSProps = {
  css?: string // Customizable class prop
  source?: string // Source identifier
}

export function ToSButton({ css, source }: TOSProps) {
  const { openToS } = useToS()

  const handleClick = () => {
    openToS(source)
  }

  return (
    <Button variant="link" onClick={handleClick} className={css || styles.tosButton}>
      Terms of Service
    </Button>
  )
}

// The actual ToS modal component
function ToSModal() {
  const { closeToS, acceptToS, source } = useToS()

  // Determine if this modal was opened from the footer
  const isFromFooter = source === "footer"

  // Prevent scrolling of the background when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    <div className={styles.modalOverlay}>
      {/* Backdrop with blur effect */}
      <div
        className={styles.modalBackdrop}
        onClick={closeToS}
        aria-label="Close Terms of Service Modal"
        aria-hidden="true"
      />

      {/* Modal container with conditional styling */}
      <div className={`${styles.modalContainer} ${isFromFooter ? styles.footerModal : ""}`}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Terms of Service</h2>
          <button className={styles.closeButton} onClick={closeToS} aria-label="Close Terms of Service">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className={`${styles.modalContent} ${isFromFooter ? styles.footerModalContent : ""}`}>
          <div className="space-y-6">
            <section className={styles.contentSection}>
              <h3 className={styles.sectionTitle}>1. Introduction</h3>
              <p className={styles.sectionText}>
                Welcome to Nylon Hosting Service. By accessing or using our GPU hosting services, you agree to be bound
                by these Terms of Service (&quot;Terms&quot;). Please read these Terms carefully before using our
                services.
              </p>
            </section>

            <section className={styles.contentSection}>
              <h3 className={styles.sectionTitle}>2. Service Description</h3>
              <p className={styles.sectionText}>
                Nylon Hosting Service provides cloud-based GPU computing resources for various applications including
                but not limited to machine learning, artificial intelligence, rendering, and scientific computing.
              </p>
              <p className={styles.sectionText}>
                Our services include GPU instance provisioning, management tools, and related technical support as
                described on our website and documentation.
              </p>
            </section>

            <section className={styles.contentSection}>
              <h3 className={styles.sectionTitle}>3. Account Registration</h3>
              <p className={styles.sectionText}>
                To use our services, you must create an account and provide accurate, complete, and current information.
              </p>
            </section>

            {/* Add more sections for the Terms of Service... */}
          </div>
        </div>

        {/* Footer with action buttons */}
        <div className={styles.modalFooter}>
          <Button
            variant="outline"
            onClick={closeToS}
            className="border-[var(--border-dark)] hover:bg-secondary"
            aria-label="Decline Terms"
          >
            Decline
          </Button>
          <Button
            onClick={acceptToS}
            className="gradient-purple-blue gradient-purple-blue-hover"
            aria-label="Accept Terms"
          >
            Accept Terms
          </Button>
        </div>
      </div>
    </div>
  )
}
