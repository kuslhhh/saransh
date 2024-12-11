"use client"

import React from 'react'
import { motion } from 'framer-motion'

const Template = ({ children } : { children: React.ReactNode }) => {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 0.5, 0.36, 1] }}
        >
            {children}
        </motion.div>
    )
}

export default Template