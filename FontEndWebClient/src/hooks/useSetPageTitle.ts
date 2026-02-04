import { useEffect, type ReactNode } from 'react';
import { useUIStore } from '../store/useUIStore';

export const useSetPageTitle = (title: string, actions?: ReactNode) => {
    const { setPageTitle, setHeaderActions } = useUIStore();

    useEffect(() => {
        setPageTitle(title);
        setHeaderActions(actions || null);

        return () => {
            setHeaderActions(null);
        };
    }, [title, actions, setPageTitle, setHeaderActions]);
};