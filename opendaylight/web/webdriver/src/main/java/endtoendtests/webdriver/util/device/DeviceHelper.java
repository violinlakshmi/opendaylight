package endtoendtests.webdriver.util.device;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class DeviceHelper {

    private WebDriver driver;

    public DeviceHelper(WebDriver driver) {
        this.driver = driver;
    }

    public void addStaticRoute(String routeName, String routeValue,
            String routeNextHop) {
        WebElement addStaticRouteButton = driver.findElement(By
                .id("one_f_switchmanager_staticRouteConfig_id_dashlet_add"));
        assertNotNull(
                "Add Static route button is not present on the Static Route Configuration dashlet.",
                addStaticRouteButton);
        assertTrue("Add Static route button is not displayed.",
                addStaticRouteButton.isDisplayed());
        assertTrue("Add Static route button is not enabled.",
                addStaticRouteButton.isEnabled());
        addStaticRouteButton.click();
        WebElement staticRouteName = driver
                .findElement(By
                        .id("one_f_switchmanager_staticRouteConfig_id_modal_form_routename"));
        staticRouteName.sendKeys(routeName);
        WebElement staticRoute = driver
                .findElement(By
                        .id("one_f_switchmanager_staticRouteConfig_id_modal_form_staticroute"));
        staticRoute.sendKeys(routeValue);
        WebElement nextHop = driver
                .findElement(By
                        .id("one_f_switchmanager_staticRouteConfig_id_modal_form_nexthop"));
        nextHop.sendKeys(routeNextHop);
        WebElement staticRouteSaveButton = driver.findElement(By
                .id("one_f_switchmanager_staticRouteConfig_id_modal_save"));
        staticRouteSaveButton.click();
    }

}
