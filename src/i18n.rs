use rust_i18n::t;

pub(super) fn format_short_list(list: &[String]) -> String {
    list.join(&t!("format.sep-short"))
}
