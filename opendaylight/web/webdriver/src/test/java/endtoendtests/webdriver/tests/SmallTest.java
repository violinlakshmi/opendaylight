package endtoendtests.webdriver.tests;

import static org.junit.Assert.*;

import java.util.List;

import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.openqa.selenium.WebElement;

import endtoendtests.webdriver.categories.NightlyTest;
import endtoendtests.webdriver.categories.SanityTest;


/**
 * Example end to end tests.
 * 
 */
public class SmallTest extends BaseTest {

    private String[] tabList = { "Devices", "Flows", "Troubleshoot",
            "TIF Manager" };

    @Test
    @Category({SanityTest.class, NightlyTest.class})
    public void testLogin() {
    
    }

//    @Test
//    @Category({SanityTest.class, NightlyTest.class})
//    public void testNavigationTabs() {
//        List<WebElement> navs = getElementMapper().getNavTabs();
//
//        assertTrue("One or more Nav tabs did not show up on the UI",
//                navs.size() == 4);
//
//        assertTrue(tabList[0] + " Tab does not exist on the main GUI.",
//                verifyTabExists(navs, tabList[0]));
//        assertTrue(tabList[1] + " Tab does not exist on the main GUI.",
//                verifyTabExists(navs, tabList[1]));
//        assertTrue(tabList[2] + " Tab does not exist on the main GUI.",
//                verifyTabExists(navs, tabList[2]));
//        assertTrue(tabList[3] + " Tab does not exist on the main GUI.",
//                verifyTabExists(navs, tabList[3]));
//    }

    private boolean verifyTabExists(List<WebElement> navs, String tabName) {
        boolean result = false;
        for (WebElement navTab : navs) {
            if (navTab.getText().contains(tabName)) {
                return true;
            }
        }
        return result;
    }

}
