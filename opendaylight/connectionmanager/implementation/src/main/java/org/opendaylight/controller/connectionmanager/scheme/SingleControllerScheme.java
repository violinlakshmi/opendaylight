package org.opendaylight.controller.connectionmanager.scheme;

import org.opendaylight.controller.clustering.services.IClusterGlobalServices;
import org.opendaylight.controller.connectionmanager.ConnectionMgmtScheme;
import org.opendaylight.controller.sal.core.Node;

class SingleControllerScheme extends AbstractScheme {

    private static AbstractScheme myScheme= null;

    protected SingleControllerScheme(IClusterGlobalServices clusterServices) {
        super(clusterServices, ConnectionMgmtScheme.SINGLE_CONTROLLER);
    }

    public static AbstractScheme getScheme(IClusterGlobalServices clusterServices) {
        if (myScheme == null) {
            myScheme = new SingleControllerScheme(clusterServices);
        }
        return myScheme;
    }

    @SuppressWarnings("deprecation")
    @Override
    public boolean isConnectionAllowedInternal(Node node) {
        if (nodeConnections == null) return true;
        // Lets make it simple. The Cluster Coordinator is the master
        if (clusterServices.amICoordinator()) return true;
        return false;
    }
}