package endtoendtests.webdriver.util;

import java.util.concurrent.TimeUnit;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public class WebDriverHelper {
	private static WebDriver driver;

	public WebDriver getDriver(String browser) {
		if (driver != null) {
			return driver;
		}
		FirefoxDriver firefoxDriver = new FirefoxDriver();
		firefoxDriver.manage().timeouts().implicitlyWait(20, TimeUnit.SECONDS);
		return firefoxDriver;
	}
}
