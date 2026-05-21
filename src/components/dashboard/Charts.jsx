'use client'

import dynamic from 'next/dynamic'

export const ProjectedTimeCard = dynamic(() => import('./ProjectedTimeCard'), { ssr: false })
export const PaceDevelopmentCard = dynamic(() => import('./PaceDevelopmentCard'), { ssr: false })
