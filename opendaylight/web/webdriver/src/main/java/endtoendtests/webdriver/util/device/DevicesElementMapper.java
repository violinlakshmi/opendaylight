package endtoendtests.webdriver.util.device;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

import endtoendtests.webdriver.util.ElementMapper;

public class DevicesElementMapper extends ElementMapper {

    private WebDriver driver;
    private WebElement nodesLearnt;

    public DevicesElementMapper(WebDriver driver) {
        super(driver);
        this.driver = driver;
    }

    public WebElement getNodesLearnt() {
        if (nodesLearnt != null) {
            return nodesLearnt;
        }
        return driver.findElement(By.id("left-top"));
    }

    public WebElement getStaticRouteAddButton() {
        WebElement staticRouteAddButton = driver.findElement(By
                .id("one_f_switchmanager_staticRouteConfig_id_dashlet_add"));
        wait.until(ExpectedConditions.visibilityOf(staticRouteAddButton));
        return staticRouteAddButton;
    }

    public WebElement getStaticRouteNameTextBox() {
        WebElement staticRouteNameTextBox = driver.findElement(By
                .id("one_f_switchmanager_staticRouteConfig_id_modal_form_routename"));
        wait.until(ExpectedConditions.visibilityOf(staticRouteNameTextBox));
        return staticRouteNameTextBox;

    }

    public WebElement getStaticRouteValueTextBox() {
        WebElement staticRouteValueTextBox = driver.findElement(By
                .id("one_f_switchmanager_staticRouteConfig_id_modal_form_staticroute"));
        wait.until(ExpectedConditions.visibilityOf(staticRouteValueTextBox));
        return staticRouteValueTextBox;
    }

    public WebElement getNextHopTextBox() {
        WebElement nextHopTextBox = driver.findElement(By
                .id("one_f_switchmanager_staticRouteConfig_id_modal_form_nexthop"));
        wait.until(ExpectedConditions.visibilityOf(nextHopTextBox));
        return nextHopTextBox;
    }

    public WebElement getStaticRouteSaveButton() {
        WebElement staticRouteSaveButton = driver.findElement(By
                .id("one_f_switchmanager_staticRouteConfig_id_modal_save"));
        wait.until(ExpectedConditions.visibilityOf(staticRouteSaveButton));
        return staticRouteSaveButton;
    }

    public WebElement getStaticRouteDashletTable() {
        WebElement staticRouteTable = driver.findElement(By
                .id("one_f_switchmanager_staticRouteConfig_id_dashlet_datagrid"));
        wait.until(ExpectedConditions.visibilityOf(staticRouteTable));
        return staticRouteTable;
    }

    public WebElement getDeleteAllStaticRoutesCheckBox() {
        WebElement deleteAllStaticRouteCheckBox = driver.findElement(By
                .id("one_f_switchmanager_staticRouteConfig_id_dashlet_selectAll"));
        wait.until(ExpectedConditions.visibilityOf(deleteAllStaticRouteCheckBox));
        return deleteAllStaticRouteCheckBox;
    }

    public WebElement getDeleteStaticRoutesButton() {
        WebElement deleteStaticRouteButton = driver.findElement(By
                .id("one_f_switchmanager_staticRouteConfig_id_dashlet_remove"));
        wait.until(ExpectedConditions.visibilityOf(deleteStaticRouteButton));
        return deleteStaticRouteButton;
    }

    public WebElement getStaticRoutesDeleteConfirmationButton() {
        WebElement staticRoutesDeleteConfirmationButton = driver.findElement(By
                .id("one_f_switchmanager_staticRouteConfig_id_modal_remove"));
        wait.until(ExpectedConditions.visibilityOf(staticRoutesDeleteConfirmationButton));
        return staticRoutesDeleteConfirmationButton;
    }
}
