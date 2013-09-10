package endtoendtests.webdriver.tests;

import org.junit.After;
import org.junit.Before;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import endtoendtests.webdriver.util.ElementMapper;
import endtoendtests.webdriver.util.WebDriverHelper;

public class BaseTest {

    public static final String CONTROLLER_URL = "http://localhost:8080/";
    public static final CharSequence username = "admin";
    public static final CharSequence password = "admin";

    private WebDriver driver;
    private ElementMapper elementMapper;
    private WebDriverHelper webDriverHelper;

    @Before
    public void setUp() {
        driver = getWebDriverHelper().getDriver("firefox");
        elementMapper = getElementMapper();
        driver.manage().window().maximize();
        login();
    }

    @After
    public void tearDown() {
        if (driver != null) {
            driver.close();
            driver.quit();
        }
    }

    public ElementMapper getElementMapper() {
        return elementMapper != null ? elementMapper
                : new ElementMapper(driver);
    }

    public WebDriverHelper getWebDriverHelper() {
        return webDriverHelper != null ? webDriverHelper
                : new WebDriverHelper();
    }

    public WebDriver getDriver() {
        return driver;
    }
    
    public void login() {
        getDriver().get(CONTROLLER_URL);
        WebElement loginForm = getDriver().findElement(
                By.className("login-form"));
        loginForm.findElement(By.name("j_username")).sendKeys(username);
        loginForm.findElement(By.name("j_password")).sendKeys(password);
        loginForm.findElement(By.tagName("button")).submit();
    }
}
