'use client'

import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import styles from "./NetworksList.module.scss"
import {INetwork} from "@/src/app/models/INetwork";
import NetworkItem from "@/src/entities/network-item/NetworkItem";
import {usePathname} from "next/navigation";
import {IServices} from "@/src/app/models/IServices";

interface NetworkListProps {
    networks: INetwork[];
    searchQuery: string;
    isServicePage: boolean;
}

const NetworksList:FC<NetworkListProps> = React.memo(({networks, searchQuery, isServicePage}) => {
    const pathname = usePathname();

    const getServiceName = useCallback((pathname: string) => {
        const parts = pathname.split('/');
        return parts[parts.length - 1];
    }, []);

    const filteredNetworks = useMemo(() => {
        let filtered = networks;
        if (isServicePage && pathname) {
            const serviceName = getServiceName(pathname).toLowerCase() as keyof IServices;
            filtered = filtered.filter(network => serviceName === 'endpoints'
                ? Object.values(network.services.endpoints).some(value => value)
                : network.services[serviceName]);
        }
        return filtered.filter((network) =>
            network.name.toUpperCase().includes(searchQuery.toUpperCase())
        );
    }, [isServicePage, networks, pathname, searchQuery, getServiceName]);

    return (
        <div className={styles.list}>
            {
                filteredNetworks.length > 0
                    ? filteredNetworks.map(network => (
                        <NetworkItem key={network.id} network={network} isServicePage={isServicePage} />
                    ))
                    : <h1>Networks not found</h1>
            }
        </div>
    );
});

NetworksList.displayName = 'NetworksList';

export default NetworksList;