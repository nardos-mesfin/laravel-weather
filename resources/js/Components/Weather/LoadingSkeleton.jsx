// resources/js/Components/Weather/LoadingSkeleton.jsx

import React from 'react';
import { motion } from 'framer-motion';

const SkeletonBox = ({ className }) => (
    <motion.div
        className={`bg-white/10 rounded-lg ${className}`}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
    />
);

const LoadingSkeleton = () => (
    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6 flex flex-col items-center text-center">
                <SkeletonBox className="h-8 w-48 mb-2" />
                <SkeletonBox className="h-4 w-32 mb-4" />
                <SkeletonBox className="h-24 w-24 rounded-full my-4" />
                <SkeletonBox className="h-16 w-32 my-2" />
                <SkeletonBox className="h-6 w-40" />
            </div>
            <div className="glass-card p-4">
                <SkeletonBox className="h-6 w-24 mb-4" />
                <div className="flex justify-between">
                    <SkeletonBox className="h-8 w-20" />
                    <SkeletonBox className="h-8 w-20" />
                </div>
            </div>
        </div>
        {/* Right Column Skeleton */}
        <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-4">
                 <SkeletonBox className="h-6 w-32 mb-4" />
                 <div className="flex space-x-6">
                    <SkeletonBox className="h-24 w-16 flex-shrink-0" />
                    <SkeletonBox className="h-24 w-16 flex-shrink-0" />
                    <SkeletonBox className="h-24 w-16 flex-shrink-0" />
                    <SkeletonBox className="h-24 w-16 flex-shrink-0" />
                    <SkeletonBox className="h-24 w-16 flex-shrink-0" />
                 </div>
            </div>
            <div className="glass-card p-4">
                 <SkeletonBox className="h-6 w-32 mb-4" />
                 <div className="space-y-3">
                    <SkeletonBox className="h-8 w-full" />
                    <SkeletonBox className="h-8 w-full" />
                    <SkeletonBox className="h-8 w-full" />
                 </div>
            </div>
        </div>
    </div>
);

export default LoadingSkeleton;