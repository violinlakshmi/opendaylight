package endtoendtests.webdriver.tests;

import static org.junit.Assert.*;

import org.junit.Test;
import org.junit.experimental.categories.Category;

import endtoendtests.webdriver.categories.Device;
import endtoendtests.webdriver.categories.NightlyTest;
import endtoendtests.webdriver.categories.SanityTest;
import endtoendtests.webdriver.util.device.DeviceHelper;
import endtoendtests.webdriver.util.device.DevicesElementMapper;

@Category({Device.class})
public class DevicesTest extends BaseTest {

    private DevicesElementMapper devicesElementMapper;
    private DeviceHelper deviceHelper;

    @Override
    public void setUp() {
        super.setUp();
        devicesElementMapper = getDeviceElementMapper();
        deviceHelper = getDeviceHelper();
        deviceHelper.deleteAllStaticRoute();
    }

    @Override
    public void tearDown() {
        deviceHelper.deleteAllStaticRoute();
    }

    @Test
    @Category({SanityTest.class, NightlyTest.class, Device.class})
    public void testStaticRoute() {
        deviceHelper.addStaticRoute("Route 1" , "1.1.1.1/22" , "2.2.2.2");
        assertTrue(devicesElementMapper.getStaticRouteDashletTable().getText().contains("Route 1"));
    }
    
    private DevicesElementMapper getDeviceElementMapper() {
        return devicesElementMapper != null ? devicesElementMapper
                : new DevicesElementMapper(getDriver());
    }
    
    private DeviceHelper getDeviceHelper() {
        return deviceHelper != null ? deviceHelper
                : new DeviceHelper(getDriver());
    }
}
