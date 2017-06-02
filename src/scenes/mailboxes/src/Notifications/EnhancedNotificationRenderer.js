import NotificationRendererUtils from './NotificationRendererUtils'
import EnhancedNotificationWindowLinux from './EnhancedNotificationWindowLinux'

const pkg = window.appPackage()
const MacNotification = process.platform === 'darwin' ? window.appNodeModulesRequire('node-mac-notifier') : null
const Win32Notification = process.platform === 'win32' ? window.appNodeModulesRequire('electron-windows-notifications') : null

class EnhancedNotificationRenderer {
  /* **************************************************************************/
  // Presentation: Darwin
  /* **************************************************************************/

  /**
  * Presents a notification on osx
  * @param title: the title of the notification
  * @param html5Options = {}: the notification info to present in html5 format
  * @param clickHandler=undefined: the handler to call on click or undefined
  * @param clickData={}: the data to provide to the click handler
  */
  presentNotificationDarwin (title, html5Options = {}, clickHandler = undefined, clickData = {}) {
    const notif = new MacNotification(title, {
      body: html5Options.body,
      icon: html5Options.icon,
      soundName: html5Options.silent ? undefined : 'default'
    })
    notif.addEventListener('click', () => {
      if (clickHandler) {
        clickHandler(clickData)
      }
    })
  }

  /**
  * Presents a mailbox notification on osx
  * @param mailboxId: the id of the mailbox the notification is for
  * @param notification: the notification info to present
  * @param clickHandler: the handler to call on click
  * @param mailboxState: the current mailbox state
  * @param settingsState: the current settings state
  */
  presentMailboxNotificationDarwin (mailboxId, notification, clickHandler, mailboxState, settingsState) {
    const { mailbox, enabled } = NotificationRendererUtils.checkConfigAndFetchMailbox(mailboxId, mailboxState, settingsState)
    if (!enabled) { return }

    let subtitle, body
    if (notification.body.length <= 1) {
      body = NotificationRendererUtils.formattedBody(notification)
    } else {
      subtitle = NotificationRendererUtils.formatText(notification.body[0].content, notification.body[0].format)
      body = notification.body.slice(1).map(({ content, format }) => {
        return NotificationRendererUtils.formatText(content, format)
      }).join('\n')
    }

    const notif = new MacNotification(NotificationRendererUtils.formattedTitle(notification), {
      subtitle: subtitle,
      body: body,
      icon: NotificationRendererUtils.preparedMailboxIcon(mailbox, mailboxState),
      soundName: NotificationRendererUtils.preparedMailboxSound(mailbox, settingsState)
    })
    notif.addEventListener('click', () => {
      if (clickHandler) {
        clickHandler(notification.data)
      }
    })
  }

  /* **************************************************************************/
  // Presentation: Win32
  /* **************************************************************************/

  /**
  * Presents a notification on osx
  * @param title: the title of the notification
  * @param html5Options = {}: the notification info to present in html5 format
  * @param clickHandler=undefined: the handler to call on click or undefined
  * @param clickData={}: the data to provide to the click handler
  */
  presentNotificationWin32 (title, html5Options = {}, clickHandler = undefined, clickData = {}) {
    NotificationRendererUtils.preparedIconWin32(html5Options.icon)
      .then((icon) => {
        const notif = new Win32Notification.ToastNotification({
          appId: pkg.name,
          template: [
            /*eslint-disable */
            '<toast>',
              '<visual>',
                '<binding template="ToastGeneric">',
                  '<text id="1" hint-maxLines="1">%s</text>',
                  '<text id="2">%s</text>',
                  '<image placement="AppLogoOverride" id="3" src="%s" />',
                '</binding>',
              '</visual>',
              `<audio src="ms-winsoundevent:Notification.Default" silent="${html5Options.silent ? 'true' : 'false'}" />`,
            '</toast>'
            /*eslint-enable */
          ].join(''),
          strings: [
            title,
            html5Options.body,
            icon
          ]
        })
        notif.on('activated', () => {
          if (clickHandler) {
            clickHandler(clickData)
          }
        })
        notif.show()
      })
  }

  /**
  * Presents a mailbox notification on win32
  * @param mailboxId: the id of the mailbox the notification is for
  * @param notification: the notification info to present
  * @param clickHandler: the handler to call on click
  * @param mailboxState: the current mailbox state
  * @param settingsState: the current settings state
  */
  presentMailboxNotificationWin32 (mailboxId, notification, clickHandler, mailboxState, settingsState) {
    const { mailbox, enabled } = NotificationRendererUtils.checkConfigAndFetchMailbox(mailboxId, mailboxState, settingsState)
    if (!enabled) { return }

    NotificationRendererUtils.preparedMailboxIconWin32(mailbox, mailboxState)
      .then((icon) => {
        const sound = NotificationRendererUtils.preparedMailboxSound(mailbox, settingsState)
        const notif = new Win32Notification.ToastNotification({
          appId: pkg.name,
          template: [
            /*eslint-disable */
            '<toast launch="launchApp">',
              '<visual>',
                '<binding template="ToastGeneric">',
                  '<text id="1" hint-maxLines="1">%s</text>',
                  '<text id="2">%s</text>',
                  '<image placement="AppLogoOverride" hint-crop="circle" id="3" src="%s" />',
                '</binding>',
              '</visual>',
              `<audio src="${sound || 'ms-winsoundevent:Notification.Default'}" silent="${sound === undefined ? 'true' : 'false'}" />`,
            '</toast>'
            /*eslint-enable */
          ].join(''),
          strings: [
            NotificationRendererUtils.formattedTitle(notification),
            NotificationRendererUtils.formattedBody(notification),
            icon
          ]
        })
        notif.on('activated', () => {
          if (clickHandler) {
            clickHandler(notification.data)
          }
        })
        notif.show()
      })
  }

  /* **************************************************************************/
  // Presentation: Linux
  /* **************************************************************************/

  /**
  * Presents a notification on linux
  * @param title: the title of the notification
  * @param html5Options = {}: the notification info to present in html5 format
  * @param clickHandler=undefined: the handler to call on click or undefined
  * @param clickData={}: the data to provide to the click handler
  */
  presentNotificationLinux (title, html5Options = {}, clickHandler = undefined, clickData = {}) {
    EnhancedNotificationWindowLinux.showNotification({
      title: title,
      body: html5Options.body,
      icon: html5Options.icon,
      silent: html5Options.silent //TODO not implemented
    }, clickHandler, clickData)
  }

  /**
  * Presents a notification on win32
  * @param mailboxId: the id of the mailbox the notification is for
  * @param notification: the notification info to present
  * @param clickHandler: the handler to call on click
  * @param mailboxState: the current mailbox state
  * @param settingsState: the current settings state
  */
  presentMailboxNotificationLinux (mailboxId, notification, clickHandler, mailboxState, settingsState) {
    const { mailbox, enabled } = NotificationRendererUtils.checkConfigAndFetchMailbox(mailboxId, mailboxState, settingsState)
    if (!enabled) { return }

    EnhancedNotificationWindowLinux.showNotification({
      title: NotificationRendererUtils.formattedTitle(notification),
      body: NotificationRendererUtils.formattedBody(notification),
      icon: NotificationRendererUtils.preparedMailboxIcon(mailbox, mailboxState)
    }, clickHandler, notification.data)
  }
}

module.exports = new EnhancedNotificationRenderer()
