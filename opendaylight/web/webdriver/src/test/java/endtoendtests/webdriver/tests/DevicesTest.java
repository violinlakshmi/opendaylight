package endtoendtests.webdriver.tests;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.junit.experimental.categories.Category;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import endtoendtests.webdriver.categories.NightlyTest;
import endtoendtests.webdriver.categories.SanityTest;
import endtoendtests.webdriver.util.device.DeviceHelper;
import endtoendtests.webdriver.util.device.DevicesElementMapper;


public class DevicesTest extends BaseTest {

    private static final String TABNAME = "Devices";
    private DevicesElementMapper devicesElementMapper;
    private DeviceHelper deviceHelper;

    @Override
    public void setUp() {
        super.setUp();
        devicesElementMapper = getDeviceElementMapper();
        deviceHelper = getDeviceHelper();
    }

   // @Test
    @Category({SanityTest.class, NightlyTest.class})
    public void testDevicesTabActive() {
        WebElement devicesTab = getElementMapper().getTab(TABNAME);
        assertNotNull("Devices tab is not available in the navigation bar",
                devicesTab);
        devicesTab.click();
        assertTrue(
                "Devices tab is not active even after clicking on the devices tab in the navbar.",
                devicesTab.getAttribute("class").equals("active"));
    }

    //@Test
    @Category(NightlyTest.class)
    public void testNodesLearntTableIsEmptyInitially() {
        WebElement nodesLearntTable = devicesElementMapper.getNodesLearnt()
                .findElement(By.tagName("table"));
        nodesLearntTable.findElement(By.className("empty"));
        assertTrue(
                "Empty nodes learnt table does not contain \"No data available\" text.",
                nodesLearntTable.getText().contains("No data available"));
    }

    /*@Test
    @Category(NightlyTest.class)
    public void testStaticRoute() {
        deviceHelper.addStaticRoute("Route 1" , "1.1.1.1/22" , "2.2.2.2");
    }*/
    
    private DevicesElementMapper getDeviceElementMapper() {
        return devicesElementMapper != null ? devicesElementMapper
                : new DevicesElementMapper(getDriver());
    }
    
    private DeviceHelper getDeviceHelper() {
        return deviceHelper != null ? deviceHelper
                : new DeviceHelper(getDriver());
    }
}
