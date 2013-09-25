package endtoendtests.webdriver.util;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ElementMapper {

    private WebDriver driver;
    private WebElement menuDiv;
    private List<WebElement> navTabs;
    public WebDriverWait wait;

    public ElementMapper(WebDriver driver) {
        this.driver = driver;
        wait = new WebDriverWait(driver, 10);
    }

    public WebElement getMenuDiv() {
        if (menuDiv != null) {
            return menuDiv;
        }
        return driver.findElement(By.id("menu"));
    }

    public List<WebElement> getNavTabs() {
        if (navTabs != null) {
            return navTabs;
        }

        WebElement navUl = getMenuDiv().findElement(By.className("nav"));
        return navUl.findElements(By.tagName("li"));
    }
    
    public WebElement getTab(String tabName) {
        for (WebElement navTab : getNavTabs()) {
            if (navTab.getText().equalsIgnoreCase(tabName)) {
                return navTab.findElement(By.tagName("a"));
            }
        }
        System.out.println("Cannot find the tab : " + tabName);
        return null;
    }

    public WebElement getVisualTopologySvg() {
        return driver.findElement(By.id("topology")).findElement(By.tagName("svg"));
    }
    
    public List<WebElement> getAllTopologyLinks() {
        return getVisualTopologySvg().findElements(By.className("link"));
    }
    
    public List<WebElement> getAllTopologySwitch() {
        return getVisualTopologySvg().findElements(By.className("switch"));
    }

    public WebElement getActiveModal() {
        List<WebElement> allModals = driver.findElements(By.className("modal-header"));
        for (WebElement modal : allModals) {
            if(modal.isDisplayed()) {
                return modal;
            }
        }
        return null;
    }
    
    public WebElement getActiveModalCloseButton() {
        List<WebElement> allModals = driver.findElements(By.className("modal-header"));
        for (WebElement modal : allModals) {
            if(modal.isDisplayed()) {
                return modal.findElement(By.className("close"));
            }
        }
        return null;
    }
    
}
