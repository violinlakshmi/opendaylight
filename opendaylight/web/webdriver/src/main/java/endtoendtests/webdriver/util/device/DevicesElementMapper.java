package endtoendtests.webdriver.util.device;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

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

}
