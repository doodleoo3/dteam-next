import React, {FC} from 'react';
import ContentItem from "@/src/entities/content-item/ContentItem";
import {TendermintContentProps} from "@/src/app/models/ITendermintContentProps";
import LoadingBlock from "@/src/shared/ui/loading-block/LoadingBlock";
import styles from "@/src/shared/ui/service-content-container/ServiceContentContainer.module.scss"

const TendermintInstallationGuide:FC<TendermintContentProps> = ({network, nodeVersion, chainId, peers}) => {
    // const [wallet, setWallet] = useState<string>("wallet");
    // const [moniker, setMoniker] = useState<string>("DTEAM_GUIDE");
    // const [port, setPort] = useState<number>(26);

    return (
        <div className={styles.container}>
            <ContentItem title={"INSTALL DEPENDENCIES"}>
                {`sudo apt update
apt install curl iptables build-essential git wget jq make gcc nano tmux htop nvme-cli pkg-config libssl-dev libleveldb-dev tar clang bsdmainutils ncdu unzip libleveldb-dev -y`}
            </ContentItem>

            <ContentItem title={"INSTALL GO"}>
                {`cd $HOME && \\
ver="1.21.3" && \\
wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz" && \\
sudo rm -rf /usr/local/go && \\
sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz" && \\
rm "go$ver.linux-amd64.tar.gz" && \\"
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.bash_profile && \\
source $HOME/.bash_profile && \\
go version`}
            </ContentItem>

            <ContentItem
                title={"SET VARIABLES"}
                // isInstallationGuidePage={true}
                // setPort={setPort}
                // setWallet={setWallet}
                // setMoniker={setMoniker}
            >
                {`echo "export WALLET="wallet"" >> $HOME/.bash_profile
echo "export MONIKER="DTEAM_GUIDE"" >> $HOME/.bash_profile
echo "export ${network.name.toUpperCase()}_PORT="26"" >> $HOME/.bash_profile
source $HOME/.bash_profile`}
            </ContentItem>

            {network.need_build_binary
                    ?
                    <ContentItem title={"BUILD BINARY"}>
                        {`cd $HOME
git clone ${network.links.git} && cd ${network.other.main_dir}
${nodeVersion 
    ? `git checkout v${nodeVersion}` 
    : `git checkout ${<LoadingBlock width={100} />}`
}
make install
${network.other.binary_name} version --long | grep -e version -e commit`}
                    </ContentItem>
                    :
                    <ContentItem title={"DOWNLOAD BINARY"}>
                        {`cd $HOME
git clone ${network.links.git}
cd ${network.other.main_dir}
${network.name === "haqq"
    ? `tar -xvzf ${network.links.binary_download.split('/').pop()}
mv $HOME/${network.other.main_dir}/bin/${network.other.binary_name} $HOME/go/bin`
    : `chmod +x ${network.links.binary_download.split('/').pop()}
mv ${network.links.binary_download.split('/').pop()} $HOME/go/bin/${network.other.binary_name}
`}

${network.other.binary_name} version --long | grep -e version -e commit`}
                    </ContentItem>
            }

            <ContentItem title={"CONFIG AND INITIALIZE NODE"}>
                {`${network.other.binary_name} config keyring-backend os
${chainId
    ? `${network.other.binary_name} config chain-id ${chainId}`
    : `${network.other.binary_name} config chain-id ${<LoadingBlock width={100}/>}`
}
${chainId
    ? `${network.other.binary_name} init "DTEAM_GUIDE" --chain-id ${chainId}`
    : `${network.other.binary_name} init "DTEAM_GUIDE" --chain-id ${<LoadingBlock width={100} />}`
}`}
            </ContentItem>

            <ContentItem title={"DOWNLOAD GENESIS AND ADDRBOOK"}>
                {`wget -O $HOME/${network.other.working_dir}/config/genesis.json https://download.dteam.tech/${network.name}/${network.type}/genesis
wget -O $HOME/${network.other.working_dir}/config/addrbook.json https://download.dteam.tech/${network.name}/${network.type}/addrbook`}
            </ContentItem>

            <ContentItem title={"SET SEEDS AND PEERS"}>
                {`SEEDS=
${peers
    ? `PEERS="${network.other.peer}@peer.${network.name}.${network.type}.dteam.tech:${network.other.p2p_port},${peers}"`
    : `PEERS="${network.other.peer}@peer.${network.name}.${network.type}.dteam.tech:${network.other.p2p_port}"`
}
sed -i -e "s/^seeds *=.*/seeds = \\"$SEEDS\\"/; s/^persistent_peers *=.*/persistent_peers = \\"$PEERS\\"/" $HOME/${network.other.working_dir}/config/config.toml`}
            </ContentItem>

            <ContentItem title={"SET CUSTOM PORTS / OPTIONAL"}>
                    {`sed -i.bak -e "s%:1317%:\${${network.name.toUpperCase()}_PORT}317%g;
s%:8080%:\${${network.name.toUpperCase()}_PORT}080%g;
s%:9090%:\${${network.name.toUpperCase()}_PORT}090%g;
s%:9091%:\${${network.name.toUpperCase()}_PORT}091%g;
s%:8545%:\${${network.name.toUpperCase()}_PORT}545%g;
s%:8546%:\${${network.name.toUpperCase()}_PORT}546%g;
s%:6065%:\${${network.name.toUpperCase()}_PORT}065%g" $HOME/${network.other.working_dir}/config/app.toml

sed -i.bak -e "s%:26658%:\${${network.name.toUpperCase()}_PORT}658%g;
s%:26657%:\${${network.name.toUpperCase()}_PORT}657%g;
s%:6060%:\${${network.name.toUpperCase()}_PORT}060%g;
s%:26656%:\${${network.name.toUpperCase()}_PORT}656%g;
s%^external_address = \\"\\"%external_address = \\"$(wget -qO- eth0.me):\${${network.name.toUpperCase()}_PORT}656\\"%;
s%:26660%:\${${network.name.toUpperCase()}_PORT}660%g" $HOME/${network.other.working_dir}/config/config.toml`}
            </ContentItem>

            {
                network.other.pruning
                    ?
                    <ContentItem title={"CONFIG PRUNING / OPTIONAL"}>
                            {`PRUNING="custom" && \\
PRUNING_KEEP_RECENT="1000" && \\
PRUNING_KEEP_EVERY="0" && \\
PRUNING_INTERVAL="10" && \\
sed -i -e "s/^pruning *=.*/pruning = \\"$PRUNING\\"/" $HOME/${network.other.working_dir}/config/app.toml && \\
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \\"$PRUNING_KEEP_RECENT\\"/" $HOME/${network.other.working_dir}/config/app.toml && \\
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \\"$PRUNING_KEEP_EVERY\\"/" $HOME/${network.other.working_dir}/config/app.toml && \\
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \\"$PRUNING_INTERVAL\\"/" $HOME/${network.other.working_dir}/config/app.toml`}
                    </ContentItem>
                    :
                    <></>
            }

            <ContentItem title={"SET MINIMUM GAS PRICE / OPTIONAL"}>
                    {`sed -i 's|minimum-gas-prices =.*|minimum-gas-prices = "0.0025${network.other.denom}"|g' $HOME/${network.other.working_dir}/config/app.toml`}
            </ContentItem>

            <ContentItem title={"DISABLE INDEXING / OPTIONAL"}>
                    {`INDEXER="null"
sed -i -e "s/^indexer *=.*/indexer = \\"$INDEXER\\"/" $HOME/${network.other.working_dir}/config/config.toml`}
            </ContentItem>

            <ContentItem title={"DISABLE SNAPSHOTS / OPTIONAL"}>
                    {`SNAPSHOT_INTERVAL=0
sed -i.bak -e "s/^snapshot-interval *=.*/snapshot-interval = \\"$SNAPSHOT_INTERVAL\\"/" ~/${network.other.working_dir}/config/app.toml`}
            </ContentItem>

            <ContentItem title={"CREATE SERVICE FILE"}>
                    {`sudo tee /etc/systemd/system/${network.other.binary_name}.service > /dev/null <<EOF
[Unit]
Description=${network.name} node
After=network-online.target
[Service]
User=$USER
WorkingDirectory=$HOME/${network.other.working_dir}
ExecStart=$(which ${network.other.binary_name}) start --home $HOME/${network.other.working_dir}
Restart=on-failure
RestartSec=5
LimitNOFILE=65535
[Install]
WantedBy=multi-user.target
EOF`}
            </ContentItem>

            <ContentItem title={"DOWNLOAD SNAPSHOT / OPTIONAL"}>
                    {`${network.other.binary_name} tendermint unsafe-reset-all --home $HOME/${network.other.working_dir}
curl https://download.${network.type}.${network.name}.dteam.tech/latest-snapshot | lz4 -dc - | tar -xf - -C $HOME/${network.other.working_dir}`}
            </ContentItem>

            <ContentItem title={"ENABLE AND START SERVICE"} >
                    {`sudo systemctl daemon-reload
sudo systemctl enable ${network.other.binary_name}                    
sudo systemctl restart ${network.other.binary_name}
sudo journalctl -u ${network.other.binary_name} -f`}
            </ContentItem>
        </div>
    );
};

export default TendermintInstallationGuide;