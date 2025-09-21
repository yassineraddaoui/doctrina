# Doctrina Space Design System

## Overview
This document outlines the design system implemented for Doctrina Space, focusing on modern UI/UX principles, accessibility, and responsive design.

## Color Palette

### Primary Colors
- **Primary Blue**: #4F46E5 (Indigo-600)
- **Primary Blue Hover**: #4338CA (Indigo-700)
- **Primary Blue Light**: #EEF2FF (Indigo-50)

### Secondary Colors
- **Success Green**: #10B981 (Emerald-500)
- **Warning Orange**: #F59E0B (Amber-500)
- **Error Red**: #EF4444 (Red-500)
- **Info Blue**: #3B82F6 (Blue-500)

### Neutral Colors
- **Gray 50**: #F9FAFB
- **Gray 100**: #F3F4F6
- **Gray 200**: #E5E7EB
- **Gray 300**: #D1D5DB
- **Gray 400**: #9CA3AF
- **Gray 500**: #6B7280
- **Gray 600**: #4B5563
- **Gray 700**: #374151
- **Gray 800**: #1F2937
- **Gray 900**: #111827

## Typography

### Font Stack
- **Primary**: Inter, system-ui, -apple-system, sans-serif
- **Monospace**: 'JetBrains Mono', Consolas, monospace

### Font Sizes
- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)
- **4xl**: 2.25rem (36px)

## Spacing System
Based on 8px grid system: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px

## Component Guidelines

### Buttons
- **Primary**: Solid background with primary color
- **Secondary**: Outlined with primary color
- **Tertiary**: Text-only with primary color
- **Destructive**: Red background for dangerous actions

### Forms
- **Input Fields**: Consistent padding, border radius, and focus states
- **Labels**: Clear hierarchy and proper association
- **Validation**: Inline feedback with appropriate colors

### Cards
- **Shadow**: Subtle elevation with consistent shadow
- **Border Radius**: 8px for consistency
- **Padding**: 24px for content areas

### Navigation
- **Clear hierarchy**: Primary and secondary navigation levels
- **Active states**: Clear indication of current page
- **Responsive**: Mobile-first approach with hamburger menu

## Accessibility Standards
- WCAG 2.1 AA compliance
- Minimum contrast ratio of 4.5:1
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators on all interactive elements

## Responsive Breakpoints
- **Mobile**: 0-640px
- **Tablet**: 641-1024px
- **Desktop**: 1025px+

## Animation Guidelines
- **Duration**: 150ms for micro-interactions, 300ms for page transitions
- **Easing**: ease-in-out for natural feel
- **Reduced motion**: Respect user preferences