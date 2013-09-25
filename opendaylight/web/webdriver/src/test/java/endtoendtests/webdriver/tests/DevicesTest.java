package endtoendtests.webdriver.tests;

import static org.junit.Assert.*;

import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.openqa.selenium.Alert;

import endtoendtests.webdriver.categories.Device;
import endtoendtests.webdriver.categories.NightlyTest;
import endtoendtests.webdriver.categories.SanityTest;
import endtoendtests.webdriver.util.device.DeviceHelper;
import endtoendtests.webdriver.util.device.DevicesElementMapper;

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
        if (devicesElementMapper.getActiveModal() != null
                && devicesElementMapper.getActiveModal().isDisplayed()) {
            devicesElementMapper.getActiveModalCloseButton().click();
        }
        deviceHelper.deleteAllStaticRoute();
        super.tearDown();
    }

    @Test
    @Category({ SanityTest.class, NightlyTest.class, Device.class })
    public void testAddStaticRouteBaseCase() {
        deviceHelper.addStaticRoute("Route 1", "1.1.1.1/22", "2.2.2.2");
        assertTrue(devicesElementMapper.getStaticRouteDashletTable().getText().contains("Route 1"));
    }

    @Test
    @Category({ SanityTest.class, NightlyTest.class, Device.class })
    public void testAddStaticRouteWithNoName() {
        deviceHelper.addStaticRoute("", "1.1.1.1/22", "2.2.2.2");
        Alert alert = getDriver().switchTo().alert();
        assertTrue("Invalid alert message for add static route." + alert.getText(), alert.getText()
                .contains("Invalid Static Route name"));
        alert.accept();
    }

    private DevicesElementMapper getDeviceElementMapper() {
        return devicesElementMapper != null ? devicesElementMapper : new DevicesElementMapper(
                getDriver());
    }

    private DeviceHelper getDeviceHelper() {
        return deviceHelper != null ? deviceHelper : new DeviceHelper(getDriver());
    }
}
