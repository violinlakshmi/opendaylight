package endtoendtests.webdriver.util.device;

import org.openqa.selenium.WebDriver;

public class DeviceHelper {

	private DevicesElementMapper devicesElementMapper;

    public DeviceHelper(WebDriver driver) {
    	devicesElementMapper = new DevicesElementMapper(driver);
    }

    public void addStaticRoute(String routeName, String routeValue,
            String routeNextHop) {
        devicesElementMapper.getStaticRouteAddButton().click();
        devicesElementMapper.getStaticRouteNameTextBox().sendKeys(routeName);
        devicesElementMapper.getStaticRouteValueTextBox().sendKeys(routeValue);
        devicesElementMapper.getNextHopTextBox().sendKeys(routeNextHop);
        devicesElementMapper.getStaticRouteSaveButton().click();
    }

    public void deleteAllStaticRoute() {
        if(devicesElementMapper.getStaticRouteDashletTable().getText().contains("0 items")) {
            return;
        }
        devicesElementMapper.getDeleteAllStaticRoutesCheckBox().click();
        devicesElementMapper.getDeleteStaticRoutesButton().click();
        if (devicesElementMapper.getStaticRoutesDeleteConfirmationButton().isDisplayed()) {
            devicesElementMapper.getStaticRoutesDeleteConfirmationButton().click();
        }
    }
    
    
}
